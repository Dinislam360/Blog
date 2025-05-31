
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false); // Default to a consistent value (e.g., false for desktop-first)
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches);
    }
    // Set initial state based on current match
    setIsMobile(mql.matches);
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return the default value until the component has mounted on the client.
  // This ensures server-rendered HTML matches the initial client render.
  if (!hasMounted) {
    return false; // Or whatever default makes sense for SSR (e.g., desktop view)
  }

  return isMobile;
}
