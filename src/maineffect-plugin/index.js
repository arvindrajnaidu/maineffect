module.exports = function () {
  return {
    visitor: {
      Identifier: {
        enter() {
          console.log("Entered!");
        },
        exit() {
          console.log("Exited!");
        }
      },
      // FunctionDeclaration(path) {
        // console.log(path)
        // return {
        //   enter() {
        //     console.log(">>>>FunctionDeclaration enter called");
        //   },
        //   exit() {
        //       console.log("FunctionDeclaration exit called");
        //   }
        // }
      // }
    }
  };
}