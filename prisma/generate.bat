prisma generate & ^
rm -r -f "..\yoga-server\src\generated"  & ^
mkdir "..\yoga-server\src\generated"  & ^
robocopy ".\generated\prisma-client" "..\yoga-server\src\generated\prisma-client" /E
