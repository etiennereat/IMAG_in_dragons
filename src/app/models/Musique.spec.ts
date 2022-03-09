import { Musique } from './Musique';

describe('Musique', () => {
  it('should create an instance', () => {
    expect(new Musique('musiqueDemo','autheurDemo',"urlMusiqueDemo","musiqueDemo")).toBeTruthy();
  });
});
