"use client";

import { getColors } from "@/const/theme";
import { cf } from "@/util/macros";
import { focusHandler } from "@/util/ui";
import clsx from "clsx";
import { ReactNode, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type DropdownProps = {
  elements: (ReactNode | string)[],
  rounded?: boolean,
  hideArrow?: boolean,
  enlarge?: boolean,
  callbacks?: (() => void)[]
};

const Dropdown: React.FC<React.PropsWithChildren<DropdownProps>> = (props) => {
  const [expanded, setExpanded] = useState(false);

  const elementRef = useRef<HTMLDivElement | null>(null);

  const colors = getColors();

  focusHandler(elementRef, () => setExpanded(false));

  return (
    <div
        ref={elementRef}
        className="relative inline-block"
    >
      <button
        role={"menu"}
        tabIndex={-1}
        className={clsx("flex flex-row justify-between items-center", `text-[${colors.text}] hover:text-[${colors.textHover}]`)}
        onClick={() => setExpanded(e => !e)}
      >
        {props.children}
        {!props.hideArrow ? expanded ? (
            <IoIosArrowUp className={"w-5 h-5"} />
        ) : (
            <IoIosArrowDown className={"w-5 h-5"} />
        ) : null}
      </button>
      <div
        className={clsx(
            `bg-[${colors.fg}]`,
            props.enlarge ? "text-lg" : "text-medium",
            "absolute right-0 w-[14rem] font-medium flex flex-col items-start w-full rounded-md rounded-tr-none py-1 drop-shadow-md", 
            expanded ? "" : "hidden"
        )}
      >
        {props.elements.map((e, i) => (
          <button
            key={i}
            role={"menuitem"}
            tabIndex={-1}
            className={`w-full py-[2px] hover:bg-[${colors.fgHover}]`}
            onClick={() => cf((props.callbacks??[])[i])}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;