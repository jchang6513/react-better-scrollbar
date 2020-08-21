import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

type LayoutProps = {
  maxHeight?: number;
  maxWidth?: number;
};

type TrackProps = {
  trackWidth?: number;
  trackHeight?: number;
  top?: number;
  left?: number;
};

type ThumbProps = {
  top?: number;
  left?: number;
  thumbWidth?: number;
  thumbHeight?: number;
};

const size = (size: number | undefined) => (size ? `${size}px` : "unset");

const Layout = styled.div<LayoutProps>`
  position: relative;
  overflow: auto;
  max-height: ${({ maxHeight }) => size(maxHeight)};
  max-width: ${({ maxWidth }) => size(maxWidth)};
  &::-webkit-scrollbar {
    display: none;
  }
  .scrollbar {
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover {
    .scrollbar {
      opacity: 1;
    }
  }
`;

const Track = styled.div<TrackProps>`
  background: transparent;
  position: fixed;
  left: ${({ left }) => size(left)};
  top: ${({ top }) => size(top)};
  margin-top: -12px;
  padding: 2px 0;
  height: ${({ trackHeight }) => size(trackHeight || 10)};
  width: ${({ trackWidth }) => size(trackWidth || 10)};
  &:hover {
    background: #fff;
    height: 15px;
    top: ${({ top }) => size(top && top - 5)};
  }
`;

const Thumb = styled.div<ThumbProps>`
  background: #777;
  position: relative;
  height: calc(100% - 3px);
  border-radius: 10px;
  top: ${({ top }) => size(top)};
  left: ${({ left }) => size(left)};
  height: ${({ thumbHeight }) => size(thumbHeight || 7)};
  width: ${({ thumbWidth }) => size(thumbWidth)};
  &:hover {
    background: #555;
  }
`;

const DndMask = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
`;

type ScrollbarState = {
  track: TrackProps;
  thumb: ThumbProps;
  dragging: boolean;
  pageX: number;
  scrollX: number;
};

type Props = React.PropsWithChildren<LayoutProps>;

export const BetterScrollbar = (props: Props) => {
  const { maxHeight, maxWidth, children } = props;
  const [horzScrollbarState, setHorzScrollbarState] = useState<ScrollbarState>({
    track: {},
    thumb: {},
    dragging: false,
    pageX: 0,
    scrollX: 0
  });

  const [verScrollbarState, setVerScrollbarState] = useState<ScrollbarState>({
    track: {},
    thumb: {},
    dragging: false,
    pageX: 0,
    scrollX: 0
  });

  const ref = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onScroll = () => {
    const { current } = ref;
    if (!current) {
      return null;
    }

    const layoutBotton = current.offsetTop + current.offsetHeight;
    const windowsBottom = window.innerHeight + window.scrollY;
    const ratio = current.offsetWidth / current.scrollWidth;

    setHorzScrollbarState({
      ...horzScrollbarState,
      track: {
        ...horzScrollbarState.track,
        left: current.offsetLeft,
        top:
          layoutBotton > windowsBottom
            ? window.innerHeight
            : window.innerHeight - (windowsBottom - layoutBotton),
        trackWidth: maxWidth
      },
      thumb: {
        ...horzScrollbarState.thumb,
        left: current.scrollLeft * ratio,
        thumbWidth: current.offsetWidth * ratio
      }
    });

    const layoutRight = current.offsetLeft + current.offsetWidth;
    const windowsRight = window.innerWidth + window.scrollX;
    const verRatio = current.offsetHeight / current.scrollHeight;

    setVerScrollbarState({
      ...verScrollbarState,
      track: {
        ...verScrollbarState.track,
        left:
          layoutRight > windowsRight
            ? window.innerWidth
            : window.innerWidth - (windowsRight - layoutRight),
        top: current.getBoundingClientRect().top,
        trackHeight: maxHeight
      },
      thumb: {
        ...verScrollbarState.thumb,
        top: current.scrollTop * verRatio,
        thumbHeight: current.offsetHeight * verRatio
      }
    });
  };

  const onMouseMove = (event: React.MouseEvent) => {
    if (horzScrollbarState.dragging) {
      const { current } = ref;
      if (current) {
        const ratio = current.offsetWidth / current.scrollWidth;
        current.scrollLeft =
          horzScrollbarState.scrollX +
          (event.pageX - horzScrollbarState.pageX) / ratio;
      }
    }
  };

  const dragging = (event: React.MouseEvent) => {
    setHorzScrollbarState({
      ...horzScrollbarState,
      dragging: true,
      pageX: event.pageX,
      scrollX: ref.current?.scrollLeft || 0
    });
  };

  const onDrop = () => {
    setHorzScrollbarState({
      ...horzScrollbarState,
      dragging: false
    });
  };

  return (
    <Layout
      ref={ref}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      onScroll={onScroll}
    >
      <div ref={childRef}>{children}</div>
      <Track className="scrollbar horz-scrollbar" {...verScrollbarState.track}>
        <Thumb
          {...verScrollbarState.thumb}
          onMouseMove={onMouseMove}
          onMouseDown={dragging}
          onMouseUp={onDrop}
        />
      </Track>
      <Track className="scrollbar horz-scrollbar" {...horzScrollbarState.track}>
        <Thumb
          {...horzScrollbarState.thumb}
          onMouseMove={onMouseMove}
          onMouseDown={dragging}
          onMouseUp={onDrop}
        />
      </Track>
      {horzScrollbarState.dragging && (
        <DndMask onMouseMove={onMouseMove} onMouseUp={onDrop} />
      )}
    </Layout>
  );
};
