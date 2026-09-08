const fs = require('fs');
const file = 'src/pages/MeuDia.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove ExpedicaoTracker from the top if/else chain
const topTarget = `        {(user?.email === "mara@hotmail.com" || currentUserName.startsWith("Rog\\u01F8rio")) ? (
          <ExpedicaoTracker />
        ) : (
          (user?.email === "livia@hotmail.com" || currentUserName.startsWith("Rog\\u01F8rio")) ? (`;

// Since there are accents, let's use indexOf and string replacement safely
const topStart = content.indexOf('{(user?.email === "mara@hotmail.com" || currentUserName.startsWith("Rog');
if (topStart !== -1) {
  const topEndStr = '      (user?.email === "livia@hotmail.com" || currentUserName.startsWith("Rog';
  const topEnd = content.indexOf(topEndStr);
  if (topEnd !== -1) {
    content = content.substring(0, topStart) + '{' + content.substring(topEnd);
  }
}

// 2. Remove the trailing parentheses from the end of the top if/else chain
const topCloseTarget = `              </div>
              )
            )
          )}`;
const topCloseFix = `              </div>
              )
          )}`;
content = content.replace(topCloseTarget, topCloseFix);

// 3. Find the reminders map and replace it with ExpedicaoTracker
const remindersStartStr = '{reminders.length > 0 && reminders.map((reminder, idx) => {';
const remindersEndStr = '{adjustments.length > 0 && adjustments.map((adj, idx) => (';

const remStart = content.indexOf(remindersStartStr);
const remEnd = content.indexOf(remindersEndStr);

if (remStart !== -1 && remEnd !== -1) {
  content = content.substring(0, remStart) + '\n<ExpedicaoTracker />\n\n' + content.substring(remEnd);
}

// 4. We also want ExpedicaoTracker for Rogerio and Mara, but wait! The bottom component is:
// {(user?.email === "mara@hotmail.com" || currentUserName.startsWith("RogǸrio")) ? (
//   <MuralExpedicao user={user} />
// ) : (
//   <>
//      <ExpedicaoTracker />
//      {adjustments...}
//   </>
// )}
// If we put ExpedicaoTracker inside the `else` (the `<>`), Rogerio and Mara won't see it!
// Let's fix that. We should move ExpedicaoTracker OUTSIDE the if/else entirely.

// Let's rewrite the bottom half manually with regex or substring.
