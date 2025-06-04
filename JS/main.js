function buttonStaggerAnimation() {
  const buttons = document.querySelectorAll("[anm-stagger-btn=wrap]");

  buttons.forEach((button) => {
    const text = button.querySelector("[anm-stagger-btn=text]");
    const direction = button.getAttribute("anm-direction");
    const isReverse = button.getAttribute("anm-reverse");
    const stagger = button.getAttribute("anm-stagger") || 0.0075;
    const delay = button.getAttribute("anm-delay") || 0;
    const duration = button.getAttribute("anm-duration") || 0.5;
    const ease = button.getAttribute("anm-ease") || "power3.inOut";
    const custom = button.getAttribute("anm-custom") || "";

    const parseCustomAttribute = (attr) => {
      const props = {};
      if (attr) {
        attr.split(",").forEach((pair) => {
          const [key, value] = pair.split(":").map((item) => item.trim());
          if (key && value) {
            props[key] = value;
          }
        });
      }
      return props;
    };

    const transformValuesForToState = (element, props) => {
      const transformedValues = {};
      const computedStyles = window.getComputedStyle(element);
      for (const key in props) {
        let value = props[key];
        if (key === "opacity") {
          transformedValues[key] = "1";
        } else {
          transformedValues[key] = value.replace(/(\d+(\.\d+)?)/g, (match) => {
            const unitMatch = match.match(
              /(\d+(\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|deg|rad|grad|turn|cvw|cvh)?/
            );
            return unitMatch ? `0${unitMatch[3] || ""}` : "0";
          });

          if (!/\d/.test(value)) {
            transformedValues[key] = computedStyles[key] || value;
          }
        }
      }
      return transformedValues;
    };

    const animationProps = parseCustomAttribute(custom);
    const toStateProps = transformValuesForToState(text, animationProps);

    const textClone = text.cloneNode(true);
    textClone.style.position = "absolute";
    text.after(textClone);

    const textSplit = new SplitType(text, { types: "chars" });
    const clonedSplit = new SplitType(textClone, { types: "chars" });

    const timeline = gsap.timeline({
      defaults: {
        ease: ease,
        delay: delay,
        duration: duration,
        stagger: stagger,
      },
      paused: true,
    });

    if (direction === "up") {
      textClone.style.top = "100%";
      timeline
        .fromTo(
          textSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: -100, ...toStateProps }
        )
        .fromTo(
          clonedSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: -100, ...toStateProps },
          "<"
        );
    } else if (direction === "down") {
      textClone.style.top = "-100%";
      timeline
        .fromTo(
          textSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: 100, ...toStateProps }
        )
        .fromTo(
          clonedSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: 100, ...toStateProps },
          "<"
        );
    }

    button.addEventListener("mouseenter", () => {
      timeline.restart();
    });

    button.addEventListener("mouseleave", () => {
      if (isReverse === "true") {
        timeline.reverse();
      } else {
        return;
      }
    });
  });
}
buttonStaggerAnimation();
