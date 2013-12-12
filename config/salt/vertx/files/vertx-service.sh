#! /bin/sh
### BEGIN INIT INFO
# Provides:           vertx-server
# Required-Start:     $remote_fs $network
# Required-Stop:      $remote_fs $network
# Default-Start:      2 3 4 5
# Default-Stop:       0 1 6
# Short-Description:  Start a vertx server as a service
### END INIT INFO
#
# Copyright (c) 2013-2014 Bayes Technologies, <kevin@bayes.me>
#
# vertx-server         Startup script for vertx
# chkconfig: - 99 02
# description: starts up vertx in daemon mode.

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
NAME=vertx
DAEMON=/opt/vertx/current/bin/vertxmod.sh
DESC="Vertx server service"
PIDFILE=/var/run/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME

# Exit if the package is not installed
[ -x "$DAEMON" ] || exit 0

# Read configuration variable file if it is present
[ -r /etc/default/$NAME ] && . /etc/default/$NAME

# Load the VERBOSE setting and other rcS variables
. /lib/init/vars.sh

# Define LSB log_* functions.
# Depend on lsb-base (>= 3.2-14) to ensure that this file is present
# and status_of_proc is working.
. /lib/lsb/init-functions



if [ ! -d /var/run/vertx ]; then
  mkdir /var/run/vertx
fi

DAEMON_OPTS="-d -P $PIDFILE -c $CONFIG -i $INTERVAL -s $SPLAY"

if [ ! -z $LOGFILE ]; then
  DAEMON_OPTS="${DAEMON_OPTS} -L $LOGFILE"
fi


running_pid() {
  pid=$1
  name=$2
  [ -z "$pid" ] && return 1
  [ ! -d /proc/$pid ] &&  return 1
  cmd=`awk '/Name:/ {print $2}' /proc/$pid/status`
  [ "$cmd" != "$name" ] &&  return 1
  return 0
}

running() {
  [ ! -f "$PIDFILE" ] && return 1
  pid=`cat $PIDFILE`
  running_pid $pid $NAME || return 1
  return 0
}

start_server() {
  if [ -z "$DAEMONUSER" ] ; then
    start_daemon -p $PIDFILE $DAEMON $DAEMON_OPTS
    errcode=$?
  else
    start-stop-daemon --start --quiet --pidfile $PIDFILE \
      --chuid $DAEMONUSER \
      --exec $DAEMON -- $DAEMON_OPTS
    errcode=$?
  fi
  return $errcode
}

stop_server() {
   if [ -z "$DAEMONUSER" ] ; then
     killproc -p $PIDFILE $DAEMON
     errcode=$?
   else
     start-stop-daemon --stop --quiet --pidfile $PIDFILE \
       --user $DAEMONUSER \
       --exec $DAEMON
     errcode=$?
   fi
   return $errcode
}

reload_server() {
  if [ -z "$DAEMONUSER" ] ; then
     killproc -p $PIDFILE $DAEMON -HUP
     errcode=$?
   else
     start-stop-daemon --stop --signal HUP --quiet --pidfile $PIDFILE \
       --user $DAEMONUSER \
       --exec $DAEMON
     errcode=$?
   fi
   return $errcode
}

run_server() {
  if [ -z "$DAEMONUSER" ] ; then
     killproc -p $PIDFILE $DAEMON -USR1
     errcode=$?
   else
     start-stop-daemon --stop --signal USR1 --quiet --pidfile $PIDFILE \
       --user $DAEMONUSER \
       --exec $DAEMON
     errcode=$?
   fi
   return $errcode
}

force_stop() {
  [ ! -e "$PIDFILE" ] && return
  if running ; then
    /bin/kill -15 $pid
    sleep "$DIETIME"s
    if running ; then
      /bin/kill -9 $pid
      sleep "$DIETIME"s
      if running ; then
        echo "Cannot kill $NAME (pid=$pid)!"
        exit 1
      fi
    fi
  fi
  rm -f $PIDFILE
}

case "$1" in
  start)
	echo "Starting"
    log_daemon_msg "Starting $DESC " "$NAME"
    if running ;  then
        log_progress_msg "apparently already running"
        log_end_msg 0
        exit 0
    fi
    if start_server ; then
        [ -n "$STARTTIME" ] && sleep $STARTTIME # Wait some time
        if  running ;  then
            log_end_msg 0
        else
            log_end_msg 1
        fi
    else
        log_end_msg 1
    fi
    ;;
  stop)
    log_daemon_msg "Stopping $DESC" "$NAME"
    if running ; then
      errcode=0
      stop_server || errcode=$?
      log_end_msg $errcode
    else
      log_progress_msg "apparently not running"
      log_end_msg 0
      exit 0
    fi
    ;;
  force-stop)
    $0 stop
    if running; then
      log_daemon_msg "Stopping (force) $DESC" "$NAME"
      errcode=0
      force_stop || errcode=$?
      log_end_msg $errcode
    fi
    ;;
  restart|force-reload)
    log_daemon_msg "Restarting $DESC" "$NAME"
    errcode=0
    stop_server || errcode=$?
    [ -n "$DIETIME" ] && sleep $DIETIME
    start_server || errcode=$?
    [ -n "$STARTTIME" ] && sleep $STARTTIME
    running || errcode=$?
    log_end_msg $errcode
    ;;
  status)
    log_daemon_msg "Checking status of $DESC" "$NAME"
    if running ;  then
      log_progress_msg "running"
      log_end_msg 0
    else
      log_progress_msg "apparently not running"
      log_end_msg 1
      exit 3
    fi
    ;;
  reload)
    if running; then
      log_daemon_msg "Reloading $DESC" "$NAME"
      errcode=0
      reload_server || errcode=$?
      log_end_msg $errcode
    fi
    ;;
  run)
    if running; then
      log_daemon_msg "Triggering run of $DESC" "$NAME"
      errcode=0
      run_server || errcode=$?
      log_end_msg $errcode
    fi
    ;;
  *)
    echo "Usage: $SCRIPTNAME {start|stop|force-stop|restart|force-reload|status|run}" >&2
    exit 1
    ;;
esac

exit 0
