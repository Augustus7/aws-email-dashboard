
/opt/vertx/vert.x-2.1M2.tar.gz:
  file:
    - managed
    - user: root
    - group: root
    - mode: 777
    - source: salt://vertx/files/vert.x-2.1M2.tar.gz
    - require:
      - pkg: openjdk-7-jdk

Run unzip vertx:
  cmd.run:
    - name: tar -xvf vert.x-2.1M2.tar.gz
    - cwd: /opt/vertx/
    - onlyif: if [ -d "/opt/vertx/vert.x-2.1M2" ]; then false; else true; fi
    - require:
      - file: /opt/vertx/vert.x-2.1M2.tar.gz

Create symbolic link:
  cmd.run:
    - name: ln -s /opt/vertx/vert.x-2.1M2 /opt/vertx/current
    - onlyif: if [ -d "/opt/vertx/current" ]; then false; else true; fi
    - require:
      - cmd: Run unzip vertx

/etc/init/vertx.conf:
  file:
    - managed
    - user: root
    - group: root
    - mode: 777
    - source: salt://vertx/files/vertx.conf
    - require:
      - cmd: Create symbolic link
