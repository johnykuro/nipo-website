import { test } from "node:test";
import assert from "node:assert/strict";
import { deploymentConfig } from "./deployment-config.mjs";

test("production builds use a clean canonical origin", () => {
  assert.deepEqual(deploymentConfig({ CONTEXT: "production", PUBLIC_SITE_URL: "https://nipobraza.co.uk/" }), {
    site: "https://nipobraza.co.uk", noIndex: false,
  });
});
test("previews cannot be made indexable by a production default", () => {
  for (const CONTEXT of ["deploy-preview", "branch-deploy", "preview-server", "dev"]) {
    assert.equal(deploymentConfig({ CONTEXT, PUBLIC_NOINDEX: "false" }).noIndex, true);
  }
  assert.equal(deploymentConfig({ PUBLIC_NOINDEX: "true" }).noIndex, true);
  assert.equal(deploymentConfig({ CF_PAGES_BRANCH: "feature", PRODUCTION_BRANCH: "main" }).noIndex, true);
  assert.equal(deploymentConfig({ CF_PAGES_BRANCH: "main", PRODUCTION_BRANCH: "main" }).noIndex, false);
});
test("malformed canonical configuration fails the build", () => {
  for (const PUBLIC_SITE_URL of ["http://nipobraza.co.uk", "https://nipobraza.co.uk/foo", "https://nipobraza.co.uk/?q=x", "https://name:password@nipobraza.co.uk", "invalid"]) {
    assert.throws(() => deploymentConfig({ PUBLIC_SITE_URL }));
  }
  assert.throws(() => deploymentConfig({ PUBLIC_NOINDEX: "yes" }));
});
