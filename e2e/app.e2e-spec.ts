import { LeagueappGuiPage } from './app.po';

describe('leagueapp-gui App', function() {
  let page: LeagueappGuiPage;

  beforeEach(() => {
    page = new LeagueappGuiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
