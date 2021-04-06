declare module '*.scss' {
  const data: Readonly<{ [className: string]: string }>
  export default data
}
