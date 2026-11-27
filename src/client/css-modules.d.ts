/** CSS Modules imports resolve to the hashed class-name map the bundle inlines. */
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

/** Plain stylesheets are imported for their side effect and contribute global rules. */
declare module '*.css' {
  const content: string
  export default content
}
