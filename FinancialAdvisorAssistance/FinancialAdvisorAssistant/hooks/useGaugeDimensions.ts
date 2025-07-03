import * as React from 'react';

interface GaugeDimensions {
  width: number;
  height: number;
}

export const useGaugeDimensions = () => {
  const [gaugeContainerRef, setGaugeContainerRef] = React.useState<HTMLDivElement | null>(null);
  const [gaugeDimensions, setGaugeDimensions] = React.useState<GaugeDimensions>({ width: 252, height: 160 });

  // Update gauge dimensions based on container size
  React.useEffect(() => {
    if (!gaugeContainerRef) return;

    const updateDimensions = () => {
      const containerRect = gaugeContainerRef.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate responsive dimensions with some padding
      const maxWidth = Math.min(containerWidth - 40, 400); // 20px padding on each side, max 400px
      const aspectRatio = 160 / 252; // Original aspect ratio (height/width)
      const calculatedHeight = maxWidth * aspectRatio;
      
      setGaugeDimensions({
        width: Math.max(200, maxWidth), // Minimum width of 200px
        height: Math.max(120, calculatedHeight) // Minimum height of 120px
      });
    };

    // Initial calculation
    updateDimensions();

    // Add resize observer for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(gaugeContainerRef);

    return () => {
      resizeObserver.disconnect();
    };
  }, [gaugeContainerRef]);

  return {
    gaugeContainerRef: setGaugeContainerRef,
    gaugeDimensions
  };
};
