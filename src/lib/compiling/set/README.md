This program implements a format for searching texts with the following grammar:

```
Quotkey:
    " any string without `"` "
QuotkeySeq:
    (Quotkey \s*)* Quotkey
Fuzykey:
    nonempty trimed string which is not Set, has no white spaces, has no `"` pair
FuzykeySeq:
    (Fuzykey \s+)* Fuzykey
Key:
    (QuotkeySeq | FuzykeySeq)+
Ids:
    (priid \s*)* priid
Rel:
    (Key | Ids | \* | \?) \s* > \s* 
    (Key | Ids | \* | \?) \s* > \s* 
    (Key | Ids | \* | \?)
Substract:
    Set \s* \ \s* Set
Intersect:
    Set \s* ∩ \s* Set
Union:
    Set \s* ∪ \s* Set
UnparenthesizedSet:
    Intersect | Substract | Union | Rel | Key | Ids
ParenthesizedSet: 
    \( \s* UnparenthesizedSet \s* \)
Set:
    UnparenthesizedSet | PparenthesizedSet
```

For example, searching videos about TypeScript or JavaScript unrelated to Deno
can be

```
video > contain > ? ∩ (typescript ∪ javascript) \ deno
```
