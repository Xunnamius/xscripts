declare namespace jest {
  interface Describe {
    /**
     * Ensures the test contained by this function are run regardless of the
     * invocation of `reconfigureJestGlobalsToSkipTestsInThisFileIfRequested`.
     */
    noskip: jest.Describe;
  }

  interface It {
    /**
     * Ensures this test is run regardless of the invocation of
     * `reconfigureJestGlobalsToSkipTestsInThisFileIfRequested`.
     */
    noskip: jest.It;
  }
}
