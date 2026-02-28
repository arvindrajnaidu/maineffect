// import { renderHook } from '@testing-library/react-hooks';
import { useQuery, UseQueryResult } from "react-query";
// import { useAccount } from './useAccount';
import { parseFn, Stubs } from "../../maineffect";

// jest.mock('react-query');

const mockedUseQuery = jest.fn();
const parsed = parseFn(require.resolve("./useAccounts"), {
  useQuery: mockedUseQuery,
//   URL: jest.fn(),
});

describe.only("useAccounts", () => {
    const stub = Stubs(jest.fn)
  test("should call useQuery with the correct parameters", async () => {
    // parsed.find('useAccount').callWith('foo');

    let fn = parsed
      .find("useAccount")
      .stub('URL()', stub.createStub)
      .stub('fetch().json()', stub.createStub)
    
    stub.getStubs().json.mockReturnValue({name: 'a'})  
    
    fn.callWith("foo")    
     
    const dataFetcher = mockedUseQuery.mock.calls[0][1];
    // console.log(await dataFetcher())

    // console.log(stub.getStubs().URL.mock.calls)
    
    //   console.log(mockedUseQuery.mock.calls[0][1])

    // expect(mockedUseQuery).toBeCalled();
  });
});
