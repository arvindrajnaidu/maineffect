import React, { useState } from "react";

const Greeting = ({ greet }) => {
  const [name, setName] = useState(greet);
//   const handleFoo = (e) => {
//     if (e.target.value === 1) {
//         setName('Harry');
//     }
//   }
  return (
    <>
      <h1>{`Hello ${name}`}</h1>
      <button
        data-testid="greet"
        onClick={() => {
          setName(`${name} the great`);
        }}
      ></button>
    </>
  );
};

export default Greeting;
