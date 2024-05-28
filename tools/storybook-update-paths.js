const fs = require("fs")

const storybookIframePath = "./storybook-static/iframe.html"

// update the paths to /assets in iframe.html, it should be relative for hosting on gh-pages
try {
  // eslint-disable-next-line no-console
  console.log("updating the storybook paths...")
  const data = fs.readFileSync(storybookIframePath, "utf8")

  fs.writeFileSync(
    storybookIframePath,
    data.replace(/"\/assets/g, '"assets'),
    "utf8",
  )
} catch (e) {
  console.warn("could not update the iframe.html relative paths")
}
