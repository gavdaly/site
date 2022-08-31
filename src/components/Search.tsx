export function Search() {
  return (
    <>
      <form>
        <label htmlFor="search">search</label>
        <input type="search" name="search" id="search" />
        <button type="submit">search</button>
      </form>
      <section>results will show here</section>
    </>
  );
}
