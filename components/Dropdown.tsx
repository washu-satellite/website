"use client";

import { cf } from "@/util/macros";
import { focusHandler } from "@/util/ui";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { ReactNode, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { motion } from 'motion/react';

type DropdownProps = {
  elements: (ReactNode | string)[][],
  hoverable?: boolean,
  rounded?: boolean,
  hideArrow?: boolean,
  enlarge?: boolean,
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
          theme === 'light' ? "bg-[#dddddd]" : "bg-black",
          "flex flex-row justify-between items-center",
          `text-text group-hover:text-text-hover px-4 rounded-md rounded-b-none bg-opacity-0 group-hover:bg-opacity-40`
        )}
        onClick={() => setExpanded(e => !e)}
      >
        {props.children}
        <motion.div
          transition={{ duration: 0.2 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: expanded ? 180 : 0 }}
        >
          <IoIosArrowUp className={"w-3 h-3"} />
        </motion.div>
      </button>
      {expanded && 
        <motion.div
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={clsx(
              "bg-fg dark:bg-bg border-bg-highlight border-[1px]",
              props.enlarge ? "text-lg" : "text-medium",
              "absolute right-0 lg:left-0 min-w-[18rem] lg:min-w-[18rem] font-medium flex flex-col items-start rounded-md rounded-tr-none lg:rounded-tl-none lg:rounded-tr-md drop-shadow-md gap-y-6 py-6 md:gap-0 md:py-1", 
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
                    className={`w-full cursor-pointer py-[2px] text-xl md:text-lg hover:bg-fg dark:hover:bg-fg-hover rounded-md`}
                    onClick={() => cf((props.callbacks??[])[i])}
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
        </motion.div>
      }
    </div>
  );
}

export default Dropdown;