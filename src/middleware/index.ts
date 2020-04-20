import {
  handleParser,
  handleCompression,
  handleCors,
  rateLimit,
} from "./common";

export default [rateLimit, handleCors, handleParser, handleCompression];
