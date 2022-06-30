type Props = {
  children?: JSX.Element | JSX.Element[]
}
/**
 * @function PopUpWrapper
 *Wrapper component for popup.
 * @returns children
 */

function PopUpWrapper({ children }: Props) {
  return <div>{children}</div>
}

export default PopUpWrapper
