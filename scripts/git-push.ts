// scripts/git-push.ts
import { execSync } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run(cmd: string): { ok: boolean; output: string } {
  try {
    const output = execSync(cmd, { encoding: "utf-8", stdio: "pipe" });
    return { ok: true, output: output.trim() };
  } catch (e: any) {
    return { ok: false, output: e.stderr?.trim() || e.message };
  }
}

async function ask(question: string, defaultValue = ""): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function main() {
  console.log("🔍 Menjalankan pengecekan...\n");

  // 1. Lint
  const lint = run("npm run lint");
  if (!lint.ok) {
    console.error("❌ ESLint error:\n" + lint.output);
    rl.close();
    process.exit(1);
  }
  console.log("✅ ESLint: OK");

  // 2. TypeScript
  const tsc = run("npx tsc --noEmit");
  if (!tsc.ok) {
    console.error("❌ TypeScript error:\n" + tsc.output);
    rl.close();
    process.exit(1);
  }
  console.log("✅ TypeScript: OK\n");

  // 3. Commit message
  const message = await ask("✏️  Commit message: ");
  if (!message) {
    console.error("❌ Commit message tidak boleh kosong");
    rl.close();
    process.exit(1);
  }

  // 4. Branch choice
  const currentBranch = run("git rev-parse --abbrev-ref HEAD").output;
  const allBranches = run(
    "git branch --format='%(refname:short)'"
  ).output.split("\n");

  console.log(`\n📌 Current branch: ${currentBranch}`);
  console.log("\n📋 Available branches:");
  allBranches.forEach((b, i) => console.log(`   ${i + 1}. ${b}`));
  console.log(`   ${allBranches.length + 1}. Buat branch baru`);

  const answer = await ask(
    `\nPilih branch (1-${allBranches.length + 1}) [default: ${currentBranch}]: `,
    currentBranch
  );

  let targetBranch = answer;

  // Handle numeric selection
  const num = parseInt(answer);
  if (!isNaN(num) && num >= 1 && num <= allBranches.length) {
    targetBranch = allBranches[num - 1];
  } else if (num === allBranches.length + 1) {
    targetBranch = await ask("🌱 Nama branch baru (kebab-case): ");
    if (!targetBranch) {
      console.error("❌ Nama branch tidak boleh kosong");
      rl.close();
      process.exit(1);
    }
    const create = run(`git checkout -b ${targetBranch}`);
    if (!create.ok) {
      console.error("❌ Gagal membuat branch:\n" + create.output);
      rl.close();
      process.exit(1);
    }
    console.log(`✅ Branch baru '${targetBranch}' dibuat`);
  }

  // 5. Switch if different
  if (targetBranch !== currentBranch) {
    const checkout = run(`git checkout ${targetBranch}`);
    if (!checkout.ok) {
      console.error("❌ Gagal pindah branch:\n" + checkout.output);
      rl.close();
      process.exit(1);
    }
  }

  // 6. Add + commit + push
  console.log("\n📦 Staging files...");
  const add = run("git add -A");
  if (!add.ok) {
    console.error("❌ Gagal stage:\n" + add.output);
    rl.close();
    process.exit(1);
  }

  console.log("📝 Commit...");
  const commit = run(`git commit -m "${message}"`);
  if (!commit.ok) {
    console.error("❌ Gagal commit:\n" + commit.output);
    rl.close();
    process.exit(1);
  }
  console.log(`✅ Commit: ${commit.output}`);

  console.log(`🚀 Push ke origin/${targetBranch}...`);
  const push = run(
    `git push -u origin ${targetBranch}`
  );
  if (!push.ok) {
    console.error("❌ Gagal push:\n" + push.output);
    rl.close();
    process.exit(1);
  }

  console.log(`\n✅ Berhasil push ke origin/${targetBranch}`);
  rl.close();
}

main();
