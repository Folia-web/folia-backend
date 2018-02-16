export LD_LIBRARY_PATH=/usr/local/lib
readonly foliaPath=/home/gick/Debian8_x64
readonly foliaExec=./Algo_LIRIS_Debian_x64
cd $foliaPath
$foliaExec $1 $2 $3 $4
