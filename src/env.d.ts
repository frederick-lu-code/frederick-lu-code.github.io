/**
 * @fontsource-variable/big-shoulders-display@5.3.0 omits the "./*.css" entry
 * from its exports map, so it has to be imported by bare specifier. TypeScript
 * wants a declaration for that, where a plain `.css` path would need none.
 */
declare module "@fontsource-variable/big-shoulders-display";
