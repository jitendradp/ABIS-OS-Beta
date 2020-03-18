import {AbisSession} from "./abisSession";

describe('AbisSession', () => {
  it('should eventually emit "true" for its loadedStatus', () => {
    const abisSession = new AbisSession("http://local.abis-cloud.com:4000");
    abisSession.loadedStatus.subscribe(o => {
      expect(o).toBeTruthy();
    });
  });
});
