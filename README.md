# Tab Muter

Re-enables the "Mute Tab" feature once found in Chrome itself.

## Background

Once upon a time, Chrome had a feature hidden away in chrome://flags to
allow users to mute individual tabs by clicking the speaker icon next to
the tab's title. This was deemed "not good enough", as the Chrome
developers wanted to remove the need for users to manually control tab
audio, so it was removed in favour of the "Mute Site" feature.

Chrome cannot yet automatically determine which tabs should be playing
audio, so I made this extension to let the user make that decision. The
button's in a different place due to Chrome API limitations, but apart
from that, this extension should work exactly as the old "Mute Tab"
feature did.

## Usage

1. Install the extension from the [Chrome Web Store][install].
2. Click the speaker icon in the toolbar (top-right) to toggle audio for
   the current tab on and off.
3. Rejoice in the knowledge that you can once again control your
   browser's behaviour in a sensible, granular fashion.

[install]: https://chrome.google.com/webstore

## Bugs

Probably! If you spot any, I'd be grateful if you could report them.

## Contributing

Please do – I'm intending to keep this extension _simple_, unlike most
of the other ones like it, so no guarantees your code will make it in,
but feel free to open a pull request and discuss.

Note that this extension includes an icon from [Font Awesome Pro][fa],
`images/muted.svg`, which I'm not allowed to distribute in source form.
There is a similar icon from Font Awesome Free at
`images/muted-free.svg`, which you can rename and use instead.

[fa]: https://fontawesome.com/

## License

GPLv3+
