import { useEffect, useRef } from "react";
import dropin from "braintree-web-drop-in";

export default function BraintreeDropIn({
  authorization,
  amount = "10.00",     // default test amount
  currency = "USD",     // default currency
  options = {},
  onInstance,
  onError,
}) {
  const dropinContainer = useRef(null);
  const dropinInstance = useRef(null);

  // Force re-render when authorization changes
  const containerKey = authorization ? authorization.slice(-8) : "noauth";

  useEffect(() => {
    let cancelled = false;

    async function setupDropin() {
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Teardown any old instance
      if (dropinInstance.current) {
        try {
          await dropinInstance.current.teardown();
        } catch (e) {
          // ignore teardown errors
        }
        dropinInstance.current = null;
        if (dropinContainer.current) dropinContainer.current.innerHTML = "";
      }

      if (
        dropinContainer.current &&
        dropinContainer.current.childNodes.length === 0 &&
        authorization &&
        !cancelled
      ) {
        dropin.create(
          {
            authorization,
            container: dropinContainer.current,
            paypal: {
              flow: "checkout",
              amount,
              currency,
              commit: true,
              buttonStyle: {
                color: "blue",
                shape: "rect",
                size: "medium",
              },
            },
            // Also allow external overrides
            ...options,
          },
          (err, instance) => {
            if (err) {
              console.error("DropIn error:", err);
              if (onError) onError(err);
              return;
            }
            dropinInstance.current = instance;
            if (onInstance) onInstance(instance);
          }
        );
      }
    }

    setupDropin();

    return () => {
      cancelled = true;
      if (dropinInstance.current) {
        dropinInstance.current.teardown();
        dropinInstance.current = null;
      }
      if (dropinContainer.current) dropinContainer.current.innerHTML = "";
    };
    // eslint-disable-next-line
  }, [authorization, amount, currency]);

  return <div key={containerKey} ref={dropinContainer} />;
}
