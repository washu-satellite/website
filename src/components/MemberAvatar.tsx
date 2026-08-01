import clsx from "clsx";
import { initials, type Member } from "@/const/content/members";

/**
 * Member avatar: shows the headshot if the JSON entry has one, otherwise a
 * deterministic initials chip (same two characters for the same name).
 *
 * Pass `size` as a Tailwind-compatible size (e.g. "size-12", "size-48") or
 * rely on the default which is the compact tile size.
 */
export function MemberAvatar(props: {
  member: Member;
  size?: string;
  className?: string;
  rounded?: "full" | "md";
}) {
  const { member, size = "size-12", className, rounded = "full" } = props;
  const roundedClass = rounded === "full" ? "rounded-full" : "rounded-md";

  if (member.headshot) {
    return (
      <img
        src={member.headshot}
        alt={member.name}
        loading="lazy"
        decoding="async"
        className={clsx(
          size,
          roundedClass,
          "object-cover shrink-0 border border-border",
          className,
        )}
      />
    );
  }

  return (
    <div
      aria-label={member.name}
      className={clsx(
        size,
        roundedClass,
        "shrink-0 flex items-center justify-center font-mono font-medium text-foreground/70 bg-secondary border border-border select-none",
        className,
      )}
    >
      {initials(member.name)}
    </div>
  );
}
