const { NODE_ENV } = process.env;

export function debug(text: string) {
  if (NODE_ENV === "development") {
    console.log(text);
  }
}

export function log(text: string) {
  console.log(text);
}
