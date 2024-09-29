import { LinkedinIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full mx-auto space-y-4 py-10 flex flex-col items-center text-center">
      <p>Made by Ishaq Ibrahim</p>
      <a target="_blank" href="https://www.linkedin.com/in/ishaq-ibrahim/">
        <LinkedinIcon />
      </a>
    </footer>
  );
};
