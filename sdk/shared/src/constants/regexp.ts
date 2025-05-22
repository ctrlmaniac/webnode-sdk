export const WEBNODE_ID_REGEXP =
  /^(?=.*[0-9a-z])(?![.-])(?:[0-9a-z]+(?:[-.]?[0-9a-z]+)*)$/;

export const BASE_DOMAIN_REGEXP =
  /^(?=.{1,253}$)((?!-)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(xn--)?([a-z0-9]+(-[a-z0-9]+)*\.)*[a-z]{2,63}$/;
