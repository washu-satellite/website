"use client";

import { getColors } from "@/const/theme";
import { cf } from "@/util/macros";
import { focusHandler } from "@/util/ui";
import clsx from "clsx";
import { ReactNode, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type DropdownProps = {
  elements: (ReactNode | string)[],
  hoverable?: boolean,
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
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button
        role={"menu"}
        tabIndex={-1}
        className={clsx("flex flex-row justify-between items-center", `text-[${colors.text}] hover:text-[${colors.textHover}] bg-black px-4 rounded-md bg-opacity-0 hover:bg-opacity-40`)}
        onClick={() => setExpanded(e => !e)}
      >
        {props.children}
        {!props.hideArrow ? expanded ? (
            <IoIosArrowUp className={"w-3 h-3"} />
        ) : (
            <IoIosArrowDown className={"w-3 h-3"} />
        ) : null}
      </button>
      <div
        className={clsx(
            `bg-[${colors.fg}] border-[${colors.bgHighlight}] border-[1px]`,
            props.enlarge ? "text-lg" : "text-medium",
            "absolute right-0 lg:left-0 min-w-[18rem] lg:min-w-[10rem] font-medium flex flex-col items-start rounded-md rounded-tr-none lg:rounded-tl-none lg:rounded-tr-md drop-shadow-md gap-y-6 py-6 md:gap-0 md:py-1", 
            expanded ? "" : "hidden"
        )}
      >
        {props.elements.map((e, i) => (
          <button
            key={i}
            role={"menuitem"}
            tabIndex={-1}
            className={`w-full py-[2px] text-xl md:text-lg hover:bg-[${colors.fgHover}]`}
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