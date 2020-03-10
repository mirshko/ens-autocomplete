import { request } from "graphql-request";

const normalize = name => new String(name).normalize("NFC");

const ENDPOINT = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

const QUERY = /* GraphQL */ `
  query lookup($name: String!) {
    domains(
      first: 8
      where: { name_starts_with: $name, resolvedAddress_not: null }
    ) {
      name
    }
  }
`;

export default async (req, res) => {
  const { name } = req.query;

  const VARS = {
    name: normalize(name)
  };

  try {
    const { domains } = await request(ENDPOINT, QUERY, VARS);

    res.status(200).json(domains);
  } catch (error) {
    res.status(404).json(error);
  }
};
