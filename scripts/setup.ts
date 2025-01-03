#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";

// Helper to execute shell commands
function execCommand(command: string) {
  return execSync(command, { stdio: "inherit" });
}

// Helper to run a prompt
async function prompt(question: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    }),
  );
}

async function main() {
  console.log(
    "Cleaning up the .git folder to initialize a new Git repository...",
  );

  // Check and remove existing .git folder
  if (fs.existsSync(".git")) {
    console.log("Removing .git folder...");
    fs.rmSync(".git", { recursive: true, force: true });
  }

  console.log("Initializing a new Git repository...");
  execCommand("git init");

  try {
    // Check if Git user.name and user.email are set
    const gitUserName = execSync("git config --get user.name")
      .toString()
      .trim();
    const gitUserEmail = execSync("git config --get user.email")
      .toString()
      .trim();

    console.log(
      `Git is already configured with:\n  Name: ${gitUserName}\n  Email: ${gitUserEmail}`,
    );
  } catch {
    // Prompt the user for their Git configuration
    console.log("Git user information is not set. Let's set it up.");

    const userName = await prompt("Enter your Git user name: ");
    const userEmail = await prompt("Enter your Git email: ");

    console.log("Setting up Git user information...");
    execCommand(`git config user.name "${userName}"`);
    execCommand(`git config user.email "${userEmail}"`);
  }

  console.log("Creating an initial commit...");
  execCommand("git add .");
  execCommand('git commit -m "Initial commit"');

  console.log(
    "All done! You can now link your own repository using 'git remote add origin <repo-url>'.",
  );
}

main().catch((error) => {
  console.error("An error occurred:", error.message);
  process.exit(1);
});
