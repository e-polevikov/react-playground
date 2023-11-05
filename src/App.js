function Button() {
  function handleClick() {
    alert("You clicked me!");
  }

  return (
    <button onClick={handleClick}>Click me!</button>
  );
}

function App() {
  return (
    <>
      <h1>React Playground</h1>
      <Button/>
    </>
  );
}

export default App;
