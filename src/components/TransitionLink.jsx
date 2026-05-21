import { Link, useLocation, useNavigate } from "react-router-dom";

function getPath(to) {
  if (typeof to === "string") return to;

  const pathname = to.pathname || "";
  const search = to.search || "";
  const hash = to.hash || "";

  return `${pathname}${search}${hash}`;
}

function isModifiedClick(event) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

function TransitionLink({
  to,
  href,
  children,
  className,
  leaveDuration = 500,
  activeResetDelay = 550,
  onClick,
  state,
  replace,
  target,
  ...props
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const nextTo = to || href || "/";
  const nextPath = getPath(nextTo);

  const moveToNextPage = () => {
    navigate(nextTo, { replace, state });
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      document.body.classList.remove("page-leave");
      document.body.classList.add("page-enter");
    });
  };

  const handleClick = (event) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      isModifiedClick(event) ||
      target === "_blank" ||
      nextPath.startsWith("http") ||
      nextPath.startsWith("mailto:") ||
      nextPath.startsWith("tel:") ||
      nextPath.startsWith("#")
    ) {
      return;
    }

    event.preventDefault();

    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    if (nextPath === currentPath) return;

    document.querySelectorAll(".active").forEach((el) => {
      el.classList.remove("active");
    });

    const page = document.querySelector("main");

    if (!page) {
      setTimeout(() => {
        moveToNextPage();
      }, activeResetDelay + leaveDuration);
      return;
    }

    document.body.classList.remove("page-enter");
    document.body.classList.remove("page-leave");

    setTimeout(() => {
      document.body.classList.add("page-leave");

      setTimeout(() => {
        moveToNextPage();
      }, leaveDuration);
    }, activeResetDelay);
  };

  return (
    <Link
      to={nextTo}
      className={className}
      onClick={handleClick}
      state={state}
      replace={replace}
      target={target}
      {...props}
    >
      {children}
    </Link>
  );
}

export default TransitionLink;
