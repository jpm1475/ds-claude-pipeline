async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString());

  const file = input.tool_response?.filePath ?? input.tool_input?.file_path ?? "";

  // Reminder only: this hook never writes to Figma.
  if (/\/packages\/tokens\/src\//.test(file) && /\.json$/.test(file)) {
    console.error(
      "Token source changed: Figma is now behind. Run the token-sync agent in push (or sync) mode " +
        "and commit packages/tokens/figma-sync.json before this PR merges; CI's figma-sync:check will fail until then.",
    );
    process.exit(2);
  }
}

main();
