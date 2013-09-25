GZ3D.SpawnModel = function(scene, domElement)
{
  this.scene = scene;
  this.domElement = ( domElement !== undefined ) ? domElement : document;
  this.init();
  this.obj = undefined;
  this.callback = undefined;
  this.counter = new Date();
};

GZ3D.SpawnModel.prototype.init = function()
{
//  this.emitter = new EventEmitter2({ verbose: true });
  this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  this.projector = new THREE.Projector();
//  this.ray = new THREE.Raycaster();
  this.ray = new THREE.Ray();
  this.obj = null;
  this.active = false;
};

GZ3D.SpawnModel.prototype.start = function(entity, callback)
{
  if (this.active)
  {
    this.finish();
  }

  this.callback = callback;

  this.obj = new THREE.Object3D();
  var mesh;
  if (entity === 'box')
  {
    mesh = this.scene.createBox(1, 1, 1);
    this.obj.name = 'unit_box_' + this.counter.getTime();
  }
  else if (entity === 'sphere')
  {
    mesh = this.scene.createSphere(0.5);
    this.obj.name = 'unit_sphere_' + this.counter.getTime();
  }
  else if (entity === 'cylinder')
  {
    mesh = this.scene.createCylinder(0.5, 1.0);
    this.obj.name = 'unit_cylinder_' + this.counter.getTime();
  }

  this.obj.add(mesh);
  this.obj.position.z += 0.5;
  this.scene.add(this.obj);

  var that = this;
  this.domElement.addEventListener( 'mousedown',
      function(event) {that.onMouseUp(event);}, false );
  this.domElement.addEventListener( 'mousemove',
      function(event) {that.onMouseMove(event);}, false );
  document.addEventListener( 'keydown',
      function(event) {that.onKeyDown(event);}, false );

  this.active = true;
};


GZ3D.SpawnModel.prototype.finish = function()
{
  this.active = false;
  var that = this;
  this.domElement.removeEventListener( 'mousedown',
      function(event) {that.onMouseUp(event);}, false );
  this.domElement.removeEventListener( 'mousemove',
      function(event) {that.onMouseMove(event);}, false );
  document.removeEventListener( 'keydown',
      function(event) {that.onKeyDown(event);}, false );

  this.scene.remove(this.obj);
  this.obj = undefined;
};

GZ3D.SpawnModel.prototype.onMouseDown = function(event)
{
  event.preventDefault();
};

GZ3D.SpawnModel.prototype.onMouseMove = function(event)
{
  if (!this.active)
  {
    return;
  }

  event.preventDefault();

  var vector = new THREE.Vector3( (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
  this.projector.unprojectVector(vector, this.scene.camera);
  this.ray.set(this.scene.camera.position,
      vector.sub(this.scene.camera.position).normalize());
  var point = this.ray.intersectPlane(this.plane);
  point.z = this.obj.position.z;
  this.scene.setPose(this.obj, point, new THREE.Quaternion());
};

GZ3D.SpawnModel.prototype.onMouseUp = function(event)
{
  if (!this.active)
  {
    return;
  }
  this.callback(this.obj);
  this.finish();
};

GZ3D.SpawnModel.prototype.onKeyDown = function(event)
{
  console.log(event.keyCode);
  if ( event.keyCode === 27 ) // Esc
  {
    this.finish();
  }
};
