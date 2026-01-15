"use client";

import { focusHandler } from "@/util/ui";
import clsx from "clsx";
import { type ReactNode, useRef, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

import useTheme from "@/hooks/useTheme";

type DropdownProps = {
  elements: (ReactNode | string)[][],
  hoverable?: boolean,
  rounded?: boolean,
  hideArrow?: boolean,
  enlarge?: boolean,
  className?: string,
  callbacks?: (() => void)[]
};

const Dropdown: React.FC<React.PropsWithChildren<DropdownProps>> = (props) => {
  const [expanded, setExpanded] = useState(false);

  const elementRef = useRef<HTMLDivElement | null>(null);

  const {theme} = useTheme();

  focusHandler(elementRef, () => setExpanded(false));

  return (
    <div
      ref={elementRef}
      className="relative group inline-block"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button
        role={"menu"}
        tabIndex={-1}
        className={clsx(
          theme === 'light' ? "bg-[rgba(221,221,221,0)] group-hover:bg-[rgba(221,221,221,1)]" : "bg-[rgba(0,0,0,0)] group-hover:bg-[rgba(0,0,0,1)]",
          "flex flex-row justify-between items-center",
          `text-text group-hover:text-text-hover px-4 rounded-md rounded-b-none bg-opacity-0`,
          props.className
        )}
        onClick={() => setExpanded(e => !e)}
      >
        {props.children}
        {!props.hideArrow &&
          <div
            // transition={{ duration: 0.2 }}
            // initial={{ rotate: 0 }}
            // animate={{ rotate: expanded ? 180 : 0 }}
          >
            <IoIosArrowUp className={"w-3 h-3"} />
          </div>
        }
      </button>
      {expanded && 
        <div
          // transition={{ duration: 0.2 }}
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          className={clsx(
              "bg-fg dark:bg-bg border-bg-highlight border-[1px]",
              props.enlarge ? "text-lg" : "text-medium",
              "absolute right-0 lg:left-0 min-w-[18rem] lg:min-w-[18rem] font-normal flex flex-col items-start rounded-md rounded-tr-none lg:rounded-tl-none lg:rounded-tr-md drop-shadow-md gap-y-6 py-6 md:gap-0 md:py-1", 
          )}
        >
          {props.elements.map((e, i) => (
            <>
              <div className="px-1">
                {e.map((ee, i) => (
                  <button
                    key={i}
                    role={"menuitem"}
                    tabIndex={-1}
                    className={`w-full cursor-pointer py-[2px] text-lg md:text-base hover:bg-fg dark:hover:bg-fg-hover rounded-md`}
                    onClick={() => (props.callbacks??[])[i]?.()}
                  >
                    {ee}
                  </button>
                ))}
              </div>
              {i < props.elements.length - 1 &&
                <div className={`w-full h-[1px] my-2 bg-bg-highlight`}/>
              }
            </>
          ))}
        </div>
      }
    </div>
  );
}

export default Dropdown;