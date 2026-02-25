const store: Record<string, string> = {};

const Cookies = {
  get: jest.fn((key: string) => store[key]),
  set: jest.fn((key: string, value: string) => {
    store[key] = value;
  }),
  remove: jest.fn((key: string) => {
    delete store[key];
  }),
};

export default Cookies;
