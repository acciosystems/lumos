const banner = `\n
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠄⠀⠀⠀⣠⡶⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⢤⠀⢤⠹⡌⠃⠀⠂⠀⠀⠀⠀⠀⠀⣠⠃⠘⣇⠀⠀⠁⠈⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠳⠼⠃⠢⠦⠙⠙⠀⠀⠀⠀⠀⢀⣤⠖⡧⠐⠚⠙⠳⠤⢀⢀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢠⣄⣄⡀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀⢠⣾⠫⠇⠀⠀⠰⠒⠂⠀⠀⠈⠒⣭⣿⡧⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣼⡅⠐⠐⠻⠶⠶⠖⠋⣉⡿⠃⠀⠀⠀⠀⠹⢿⣇⣆⣀⣠⡀⠔⢾⣿⠋⠈⠙⢝⣾⠿⢹⣟⢶⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠙⢧⡀⠀⠄⢠⣆⣌⢸⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢆⠀⢱⠀⠀⠀⠀⠈⠀⠀⠉⢺⠿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠙⣇⢀⠀⠉⠳⠷⣿⣦⣤⣴⣶⡄⠀⣀⠀⠀⡀⣠⣄⣀⣀⡙⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠉⠘⠓⣀⠤⣤⡀⠀⠀⢀⠀⣀
⠀⠀⠀⡏⠘⣻⣷⠶⠶⣲⣬⣬⣥⣤⠄⣀⣤⠼⠟⠋⠉⠁⠀⠉⠉⠟⠛⠻⢶⣤⡀⠀⠀⠀⡀⢤⣄⠀⠀⠉⠚⠛⠓⠒⠟⠋⠀
⠀⠀⠀⣿⣷⠋⠀⠀⠀⠀⠀⠙⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⠢⡀⠀⠙⠙⠊⠠⠲⣢⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⣁⡀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠀⠀⠀⠀⠤⠳⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠑⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

Coded by baxthus - https://baxt.dev
Licensed under CC BY-NC-ND 4.0 - https://creativecommons.org/licenses/by-nc-nd/4.0
`;

const phrase = `
“Bite the apple and I insist you take my hand
 Gardener of Eden”
— Saint Avangeline
\n`;

const bannerStyle =
  'color: hotpink; font-family: ui-monospace, monospace; font-weight: bold; font-size: 12px;';
const phraseStyle =
  'color: hotpink; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px;';

// oxlint-disable-next-line no-console
export const logBanner = () => console.log(`%c${banner}%c${phrase}`, bannerStyle, phraseStyle);
