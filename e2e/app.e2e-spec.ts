import { MeanBoilerplate2Page } from './app.po';

describe('mean-boilerplate-2 App', function() {
  let page: MeanBoilerplate2Page;

  beforeEach(() => {
    page = new MeanBoilerplate2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
