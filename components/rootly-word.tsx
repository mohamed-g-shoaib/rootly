import * as React from "react"

type RootlyWordProps = React.SVGProps<SVGSVGElement>

const RootlyWord = (props: RootlyWordProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 355.65 50.8"
    fill="currentColor"
    {...props}
  >
    <text
      xmlSpace="preserve"
      x={34.103}
      y={110.198}
      fontSize="50.8px"
      fontFamily="QuinqueFive"
      letterSpacing={0}
      writingMode="lr-tb"
      direction="ltr"
      fill="currentColor"
      stroke="none"
      strokeWidth={1.211}
      transform="translate(-34.103 -69.568)"
    >
      <tspan
        x={34.103}
        y={110.198}
        fill="currentColor"
        stroke="none"
        strokeWidth={1.211}
      >
        {"ROOTLY"}
      </tspan>
    </text>
  </svg>
)

RootlyWord.displayName = "RootlyWord"

export default RootlyWord
