import { ensureLogin } from '../utils/HelpUtil';
import { waitInSeconds } from '../utils/WaitUtil';
import ClientHistoryRequest from '../utils/ClientHistoryRequest';
import * as mock from '../mock';

const authzProfileBody = require('../mock/data/authzProfile');

export default (auth, client, accountExtension, account) => {
  describe('AccountExtension:', function () {
    this.timeout(20000);
    mock.mockClient(client);

    let isLoginSuccess;
    const clientHistoryRequest = new ClientHistoryRequest(new Map(), client);

    afterEach(async function () {
      await auth.logout();
      await waitInSeconds(1);
    });

    it('Should load availableExtensions when there is ReadExtensions permission', async () => {
      mock.restore();
      mock.mockForLogin();
      isLoginSuccess = await ensureLogin(auth, account);
      if (!isLoginSuccess) {
        console.error('Skip test case as failed to login with credential ', account);
        this.skip();
      }
      this.retries(2);
      await waitInSeconds(1);
      expect(accountExtension.availableExtensions.length).equal(2);
    });

    it("Should not load numbers when there isn't ReadExtensions permission", async () => {
      mock.restore();
      mock.mockForLogin({ mockAuthzProfile: false });
      mock.authzProfile({
        permissions: authzProfileBody.permissions.filter(p => p.permission.id !== 'ReadExtensions')
      });
      isLoginSuccess = await ensureLogin(auth, account);
      if (!isLoginSuccess) {
        console.error('Skip test case as failed to login with credential ', account);
        this.skip();
      }
      this.retries(2);
      await waitInSeconds(1);
      expect(accountExtension.availableExtensions.length).equal(0);
    });
  });
};
