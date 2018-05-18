/**
 * Octicons icon set component.
 * Usage: <Octicons name="icon-name" size={20} color="#4F8EF7" />
 */

import createIconSet from './lib/create-icon-set';
const glyphMap = {
  "alert": 61485,
  "arrow-down": 61503,
  "arrow-left": 61504,
  "arrow-right": 61502,
  "arrow-small-down": 61600,
  "arrow-small-left": 61601,
  "arrow-small-right": 61553,
  "arrow-small-up": 61599,
  "arrow-up": 61501,
  "microscope": 61661,
  "beaker": 61661,
  "bell": 61662,
  "bold": 61666,
  "book": 61447,
  "bookmark": 61563,
  "briefcase": 61651,
  "broadcast": 61512,
  "browser": 61637,
  "bug": 61585,
  "calendar": 61544,
  "check": 61498,
  "checklist": 61558,
  "chevron-down": 61603,
  "chevron-left": 61604,
  "chevron-right": 61560,
  "chevron-up": 61602,
  "circle-slash": 61572,
  "circuit-board": 61654,
  "clippy": 61493,
  "clock": 61510,
  "cloud-download": 61451,
  "cloud-upload": 61452,
  "code": 61535,
  "comment-add": 61483,
  "comment": 61483,
  "comment-discussion": 61519,
  "credit-card": 61509,
  "dash": 61642,
  "dashboard": 61565,
  "database": 61590,
  "clone": 61660,
  "desktop-download": 61660,
  "device-camera": 61526,
  "device-camera-video": 61527,
  "device-desktop": 62076,
  "device-mobile": 61496,
  "diff": 61517,
  "diff-added": 61547,
  "diff-ignored": 61593,
  "diff-modified": 61549,
  "diff-removed": 61548,
  "diff-renamed": 61550,
  "ellipsis": 61594,
  "eye-unwatch": 61518,
  "eye-watch": 61518,
  "eye": 61518,
  "file-binary": 61588,
  "file-code": 61456,
  "file-directory": 61462,
  "file-media": 61458,
  "file-pdf": 61460,
  "file-submodule": 61463,
  "file-symlink-directory": 61617,
  "file-symlink-file": 61616,
  "file-text": 61457,
  "file-zip": 61459,
  "flame": 61650,
  "fold": 61644,
  "gear": 61487,
  "gift": 61506,
  "gist": 61454,
  "gist-secret": 61580,
  "git-branch-create": 61472,
  "git-branch-delete": 61472,
  "git-branch": 61472,
  "git-commit": 61471,
  "git-compare": 61612,
  "git-merge": 61475,
  "git-pull-request-abandoned": 61449,
  "git-pull-request": 61449,
  "globe": 61622,
  "graph": 61507,
  "heart": 9829,
  "history": 61566,
  "home": 61581,
  "horizontal-rule": 61552,
  "hubot": 61597,
  "inbox": 61647,
  "info": 61529,
  "issue-closed": 61480,
  "issue-opened": 61478,
  "issue-reopened": 61479,
  "italic": 61668,
  "jersey": 61465,
  "key": 61513,
  "keyboard": 61453,
  "law": 61656,
  "light-bulb": 61440,
  "link": 61532,
  "link-external": 61567,
  "list-ordered": 61538,
  "list-unordered": 61537,
  "location": 61536,
  "gist-private": 61546,
  "mirror-private": 61546,
  "git-fork-private": 61546,
  "lock": 61546,
  "logo-gist": 61613,
  "logo-github": 61586,
  "mail": 61499,
  "mail-read": 61500,
  "mail-reply": 61521,
  "mark-github": 61450,
  "markdown": 61641,
  "megaphone": 61559,
  "mention": 61630,
  "milestone": 61557,
  "mirror-public": 61476,
  "mirror": 61476,
  "mortar-board": 61655,
  "mute": 61568,
  "no-newline": 61596,
  "octoface": 61448,
  "organization": 61495,
  "package": 61636,
  "paintcan": 61649,
  "pencil": 61528,
  "person-add": 61464,
  "person-follow": 61464,
  "person": 61464,
  "pin": 61505,
  "plug": 61652,
  "repo-create": 61533,
  "gist-new": 61533,
  "file-directory-create": 61533,
  "file-add": 61533,
  "plus": 61533,
  "primitive-dot": 61522,
  "primitive-square": 61523,
  "pulse": 61573,
  "question": 61484,
  "quote": 61539,
  "radio-tower": 61488,
  "repo-delete": 61441,
  "repo": 61441,
  "repo-clone": 61516,
  "repo-force-push": 61514,
  "gist-fork": 61442,
  "repo-forked": 61442,
  "repo-pull": 61446,
  "repo-push": 61445,
  "rocket": 61491,
  "rss": 61492,
  "ruby": 61511,
  "search-save": 61486,
  "search": 61486,
  "server": 61591,
  "settings": 61564,
  "shield": 61665,
  "log-in": 61494,
  "sign-in": 61494,
  "log-out": 61490,
  "sign-out": 61490,
  "smiley": 61671,
  "squirrel": 61618,
  "star-add": 61482,
  "star-delete": 61482,
  "star": 61482,
  "stop": 61583,
  "repo-sync": 61575,
  "sync": 61575,
  "tag-remove": 61461,
  "tag-add": 61461,
  "tag": 61461,
  "tasklist": 61669,
  "telescope": 61576,
  "terminal": 61640,
  "text-size": 61667,
  "three-bars": 61534,
  "thumbsdown": 61659,
  "thumbsup": 61658,
  "tools": 61489,
  "trashcan": 61648,
  "triangle-down": 61531,
  "triangle-left": 61508,
  "triangle-right": 61530,
  "triangle-up": 61610,
  "unfold": 61497,
  "unmute": 61626,
  "unverified": 61672,
  "verified": 61670,
  "versions": 61540,
  "watch": 61664,
  "remove-close": 61569,
  "x": 61569
};

let Octicons = createIconSet(glyphMap, 'octicons', 'Octicons.ttf');

module.exports = Octicons;
module.exports.glyphMap = glyphMap;

