use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;
use worker::*;

mod utils;

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        req.cf().region().unwrap_or("unknown region".into())
    );
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    log_request(&req);

    // Optionally, get more helpful error messages written to the console in the case of a panic.
    utils::set_panic_hook();

    // Optionally, use the Router to handle matching endpoints, use ":name" placeholders, or "*name"
    // catch-alls to match on specific patterns. Alternatively, use `Router::with_data(D)` to
    // provide arbitrary data that will be accessible in each route via the `ctx.data()` method.
    let router = Router::new();

    // Add as many routes as your Worker needs! Each route will get a `Request` for handling HTTP
    // functionality and a `RouteContext` which you can use to  and get route parameters and
    // Environment bindings like KV Stores, Durable Objects, Secrets, and Variables.
    router
        .get("/", |_, _| Response::empty())
        .post_async("/form/:field", |mut req, ctx| async move {
            if let Some(name) = ctx.param("field") {
                let form = req.form_data().await?;
                match form.get(name) {
                    Some(FormEntry::Field(value)) => {
                        return Response::from_json(&json!({ name: value }))
                    }
                    Some(FormEntry::File(_)) => {
                        return Response::error("`field` param in form shouldn't be a File", 422);
                    }
                    None => return Response::error("Bad Request", 400),
                }
            }

            Response::error("Bad Request", 400)
        })
        .post_async("/contact", |mut req, ctx| async move {
            let form = req.json::<Contact>().await?;
            let store = ctx.kv("gavdev_contact")?;
            let uuid = Uuid::new_v4().to_string();
            store.put(&uuid, &form)?;
            Response::from_json(&json!(form))
        })
        .post_async("/webmention", |mut req, ctx| async move {
            let store = ctx.kv("webmention")?;
            let uuid = Uuid::new_v4().to_string();
            let data = req.form_data().await?;
            let target = data.get("target");
            let source = data.get("source");

            if let Some(target) = target {
                if let Some(source) = source {
                    let (tar, sou) = match (target, source) {
                        (FormEntry::Field(t), FormEntry::Field(s)) => (t, s),
                        _ => return Err(worker::Error::BadEncoding),
                    };
                    store.put(
                        &uuid,
                        Webmention {
                            target: tar,
                            source: sou,
                        },
                    )?;
                }
            }

            Response::ok("")
        })
        .get("/worker-version", |_, ctx| {
            let version = ctx.var("WORKERS_RS_VERSION")?.to_string();
            Response::ok(version)
        })
        .run(req, env)
        .await
}

#[derive(Serialize, Deserialize)]
struct Contact {
    name: String,
    email: String,
    message: String,
}

#[derive(Serialize, Deserialize)]
struct Webmention {
    source: String,
    target: String,
}
