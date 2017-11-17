describe('Gzscene tests', function() {

  var scene;
  var gui;
  var sdfparser;

  beforeAll(function(){
    scene = new GZ3D.Scene();
    gui = new GZ3D.Gui(scene);
    sdfparser = new GZ3D.SdfParser(scene, gui);
  });

  describe('Test gzscene Initialize', function() {
    it('Intial values should match', function() {

        var bbox, indices, positions, boxGeometry,
        bbox_rotation, jointTypes, jointAxis, jointAxisMeshes,
        jointMainAxisMeshes, mesh, rot, pos, mainAxisLen,
        jointRotMeshes, jointTransMeshes, jointScrewMeshes;
        var vec3 = new THREE.Vector3(0,0,0);
        scene.init();
        expect(scene.manipulationMode).toEqual('view');
        expect(scene.name).toEqual('default');

        // Grid initialize
        expect(scene.grid.position.z).toEqual(0.05);
        expect(scene.grid.rotation.x).toEqual(Math.PI * 0.5);
        expect(scene.grid.name).toEqual('grid');
        expect(scene.grid.material.transparent).toEqual(true);
        expect(scene.grid.material.opacity).toEqual(0.5);
        expect(scene.grid.visible).toEqual(false);

        expect(scene.showCollisions).toEqual(false);

        expect(scene.emitter).toEqual(new EventEmitter2({ verbose: true }));

        expect(scene.timeDown).toEqual(null);

        // Bounding Box
        indices = new Uint16Array(
          [ 0, 1, 1, 2, 2, 3, 3, 0,
            4, 5, 5, 6, 6, 7, 7, 4,
            0, 4, 1, 5, 2, 6, 3, 7 ] );

        positions = new Float32Array(8 * 3);
        boxGeometry = new THREE.BufferGeometry();
        boxGeometry.setIndex(new THREE.BufferAttribute( indices, 1 ));
        boxGeometry.addAttribute( 'position',
              new THREE.BufferAttribute(positions, 3));

        bbox = scene.boundingBox;
        bbox_rotation = bbox.rotation;
        expect(bbox.geometry.index.array).toEqual(indices);
        expect(bbox.geometry.attributes.position.array).toEqual(positions);
        expect(bbox_rotation._x).toEqual(0);
        expect(bbox_rotation._y).toEqual(0);
        expect(bbox_rotation._z).toEqual(0);
        expect(bbox.visible).toEqual(false);

        // Joint visuals
        jointTypes =
        {
          REVOLUTE: 1,
          REVOLUTE2: 2,
          PRISMATIC: 3,
          UNIVERSAL: 4,
          BALL: 5,
          SCREW: 6,
          GEARBOX: 7,
          FIXED: 8
        };

        jointAxis = scene.jointAxis;
        expect(scene.jointTypes).toEqual(jointTypes);
        expect(jointAxis.name).toEqual('JOINT_VISUAL');

        // Joint Axes XYZ
        jointAxisMeshes = jointAxis['XYZaxes'].children;

        mesh = jointAxisMeshes[0];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0.15;
        vec3.y = 0;
        vec3.z = 0;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0xff0000));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(0);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(-Math.PI/2);

        mesh = jointAxisMeshes[1];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0;
        vec3.y = 0.15;
        vec3.z = 0;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0x00ff00));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(0);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        mesh = jointAxisMeshes[2];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0;
        vec3.y = 0;
        vec3.z = 0.15;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0x0000ff));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(Math.PI/2);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        mesh = jointAxisMeshes[3];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0.3;
        vec3.y = 0;
        vec3.z = 0;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0xff0000));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(0);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(-Math.PI/2);

        mesh = jointAxisMeshes[4];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0.;
        vec3.y = 0.3;
        vec3.z = 0;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0x00ff00));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(0);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        mesh = jointAxisMeshes[5];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0;
        vec3.y = 0;
        vec3.z = 0.3;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0x0000ff));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(Math.PI/2);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        // Joint MainAxis
        jointMainAxisMeshes = jointAxis['mainAxis'].children;
        mainAxisLen = 0.3;

        mesh = jointMainAxisMeshes[0];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0;
        vec3.y = 0;
        vec3.z = mainAxisLen * 0.5;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0xffff00));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(Math.PI/2);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        mesh = jointMainAxisMeshes[1];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0;
        vec3.y = 0;
        vec3.z = mainAxisLen;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0xffff00));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(Math.PI/2);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        // Joint RotAxis
        jointRotMeshes = jointAxis['rotAxis'].children;

        mesh = jointRotMeshes[0];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0;
        vec3.y = 0;
        vec3.z = mainAxisLen;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0xffff00));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(0);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        mesh = jointRotMeshes[1];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0;
        vec3.y = -0.04;
        vec3.z = mainAxisLen;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0xffff00));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(0);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(Math.PI/2);

        // Joint TransAxis
        jointTransMeshes = jointAxis['transAxis'].children;

        mesh = jointTransMeshes[0];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0.03;
        vec3.y = 0.03;
        vec3.z = mainAxisLen * 0.5;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(Math.PI/2);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        mesh = jointTransMeshes[1];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0.03;
        vec3.y = 0.03;
        vec3.z = mainAxisLen * 0.5 + 0.05;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(-Math.PI/2);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        mesh = jointTransMeshes[2];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0.03;
        vec3.y = 0.03;
        vec3.z = mainAxisLen * 0.5 - 0.05;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(Math.PI/2);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

        // Joint ScrewAxis
        jointScrewMeshes = jointAxis['screwAxis'].children;

        mesh = jointScrewMeshes[0];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = -0.04;
        vec3.y = 0;
        vec3.z = mainAxisLen - 0.11;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0xffff00));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(-Math.PI/10);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(-Math.PI/4);

        mesh = jointScrewMeshes[1];
        pos = mesh.position;
        rot = mesh.rotation;
        vec3.x = 0;
        vec3.y = 0;
        vec3.z = mainAxisLen - 0.23;
        expect(mesh.name).toEqual('JOINT_VISUAL');
        expect(mesh.material.color).toEqual(new THREE.Color(0xffff00));
        expect(pos).toEqual(vec3);
        expect(rot.x).toEqual(0);
        expect(rot.y).toEqual(0);
        expect(rot.z).toEqual(0);

    });
  });

  describe('Test gzscene Set Pose', function() {
    it('Position and orientation of the returned model should match', function() {

      var model, pos, ori, quaternion;
      pos = new THREE.Vector3(-1,0.5,3);
      ori = new THREE.Quaternion(0.1,-0.3,2,0);
      model = new THREE.Object3D();
      scene.setPose(model, pos, ori);
      expect(model.position).toEqual(pos);

      quaternion = model.quaternion;
      expect(quaternion.x).toEqual(ori.x);
      expect(quaternion.y).toEqual(ori.y);
      expect(quaternion.z).toEqual(ori.z);
      expect(quaternion.w).toEqual(ori.w);
    });
  });

  describe('Test gzscene Set SDFParser', function() {
    it('Should return the scene SdfParser ', function() {

      scene.setSDFParser(sdfparser);
      expect(scene.spawnModel.sdfParser).toEqual(sdfparser);
    });
  });

  // Test manipulation_mode
  describe('Test manipulation mode', function() {
    it('Should change manipulation mode to translate', function() {

      guiEvents.emit('manipulation_mode', 'translate');
      expect(scene.manipulationMode).not.toEqual('view');
      expect(scene.manipulationMode).toEqual('translate');
    });
  });

  describe('Spawn a model', function() {
    it('should add a model to the scene and then removes it', function() {
      var sdf, model;
      var xhttp = new XMLHttpRequest();
      xhttp.overrideMimeType('text/xml');
      xhttp.open('GET', 'http://localhost:9876/base/gz3d/test/utils/beer/model.sdf', false);
      xhttp.send();
      sdf = xhttp.responseXML;
      model = sdfparser.spawnFromSDF(sdf);
      scene.add(model);

      model = scene.getByName('beer');
      expect(model).not.toEqual(undefined);

      scene.remove(model);
      model = scene.getByName('beer');
      expect(model).toEqual(undefined);
    });
  });

  describe('Spawn a model with an obj mesh', function() {
    it('should add a model to the scene and then removes it', function() {
      var sdf, model;
      var xhttp = new XMLHttpRequest();
      xhttp.overrideMimeType('text/xml');
      xhttp.open('GET', 'http://localhost:9876/base/gz3d/test/utils/walkway_metal_straight/model.sdf', false);
      xhttp.send();
      sdf = xhttp.responseXML;
      model = sdfparser.spawnFromSDF(sdf);
      scene.add(model);

      model = scene.getByName('walkway_metal_straight');
      expect(model).not.toEqual(undefined);

      scene.remove(model);
      model = scene.getByName('walkway_metal_straight');
      expect(model).toEqual(undefined);
    });
  });

  describe('Spawn a model with a collada mesh', function() {
    it('should add a model to the scene and then removes it', function() {
      var sdf, model;
      var xhttp = new XMLHttpRequest();
      xhttp.overrideMimeType('text/xml');
      xhttp.open('GET', 'http://localhost:9876/base/gz3d/test/utils/house_2/model.sdf', false);
      xhttp.send();
      sdf = xhttp.responseXML;
      model = sdfparser.spawnFromSDF(sdf);
      scene.add(model);

      model = scene.getByName('House 2');
      expect(model).not.toEqual(undefined);

      scene.remove(model);
      model = scene.getByName('House 2');
      expect(model).toEqual(undefined);
    });
  });

  describe('Spawn a model with no mesh using the file api', function() {
    it('should add a model to the scene using the model files and then removes it', function() {
      var sdf, model, obj;
      var xhttp = new XMLHttpRequest();
      xhttp.overrideMimeType('text/xml');
      xhttp.open('GET', 'http://localhost:9876/base/gz3d/test/utils/beer/model.sdf', false);
      xhttp.send();
      sdf = xhttp.responseXML;

      model = scene.getByName('beer');
      expect(model).toEqual(undefined);

      obj = scene.createFromSdf(sdf);
      scene.add(obj);
      model = scene.getByName('beer');

      expect(model).not.toEqual(undefined);
      scene.remove(model);
      model = scene.getByName('beer');
      expect(model).toEqual(undefined);
    });
  });

  describe('Spawn a model with obj mesh using the file api', function() {
    it('should add a model to the scene using the model files and then removes it', function() {
      var sdf, obj, mtl, model, modelName, xhttp_1, xhttp_2, xhttp_3;
      xhttp_1 = new XMLHttpRequest();
      xhttp_1.overrideMimeType('text/xml');
      xhttp_1.open('GET', 'http://localhost:9876/base/gz3d/test/utils/walkway_metal_straight/model.sdf', false);
      xhttp_1.send();
      sdf = xhttp_1.responseXML;

      xhttp_2 = new XMLHttpRequest();
      xhttp_2.overrideMimeType('text/plain');
      xhttp_2.open('GET', 'http://localhost:9876/base/gz3d/test/utils/walkway_metal_straight/meshes/mesh.obj', false);
      xhttp_2.send();
      obj = xhttp_2.responseText;
      sdfparser.meshes['mesh.obj'] = obj;

      xhttp_3 = new XMLHttpRequest();
      xhttp_3.overrideMimeType('text/xml');
      xhttp_3.open('GET', 'http://localhost:9876/base/gz3d/test/utils/walkway_metal_straight/meshes/mesh.mtl', false);
      xhttp_3.send();
      mtl = xhttp_3.responseText;
      sdfparser.meshes['mesh.mtl'] = mtl;

      model = scene.getByName('walkway_metal_straight');
      expect(model).toEqual(undefined);

      obj = scene.createFromSdf(sdf);
      scene.add(obj);
      model = scene.getByName('walkway_metal_straight');

      expect(model).not.toEqual(undefined);
      scene.remove(model);
      model = scene.getByName('walkway_metal_straight');
      expect(model).toEqual(undefined);
    });
  });

  describe('Spawn a model where the mesh files are undefined', function() {
    it('should add a model to the scene using the model files and then removes it', function() {
      var sdf, model, xhttp_1;
      xhttp_1 = new XMLHttpRequest();
      xhttp_1.overrideMimeType('text/xml');
      xhttp_1.open('GET', 'http://localhost:9876/base/gz3d/test/utils/walkway_metal_straight/model.sdf', false);
      xhttp_1.send();
      sdf = xhttp_1.responseXML;

      sdfparser.meshes['mesh.obj'] = undefined;

      sdfparser.meshes['mesh.mtl'] = undefined;

      model = scene.getByName('walkway_metal_straight');
      expect(model).toEqual(undefined);

      obj = scene.createFromSdf(sdf);
      scene.add(obj);
      model = scene.getByName('walkway_metal_straight');

      expect(model).not.toEqual(undefined);
      scene.remove(model);
      model = scene.getByName('walkway_metal_straight');
      expect(model).toEqual(undefined);
    });
  });

  describe('Spawn a model where all the files are undefined', function() {
    it('shouldnt add amodel to the scene', function() {
      var model;

      sdfparser.meshes['mesh.obj'] = undefined;

      sdfparser.meshes['mesh.mtl'] = undefined;

      model = scene.getByName('walkway_metal_straight');
      expect(model).toEqual(undefined);

      obj = scene.createFromSdf(undefined);

      expect(obj).toEqual(undefined);
    });
  });

    describe('Spawn a model with a collada mesh', function() {
      it('should add a model to the scene and then removes it', function() {
        var sdf, model;
        var xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType('text/xml');
        xhttp.open('GET', 'http://localhost:9876/base/gz3d/test/utils/house_2/model.sdf', false);
        xhttp.send();
        sdf = xhttp.responseXML;
        model = sdfparser.spawnFromSDF(sdf);
        scene.add(model);

        model = scene.getByName('House 2');
        expect(model).not.toEqual(undefined);

        scene.remove(model);
        model = scene.getByName('House 2');
        expect(model).toEqual(undefined);
      });
    });

  // Test inertia visualizations
  describe('Test inertia visuals', function() {
    it('Should toggle inertia visualizations', function() {
      var sdf, object, visual, model, xhttp;

      xhttp = new XMLHttpRequest();
      xhttp.overrideMimeType('text/xml');
      xhttp.open('GET', 'http://localhost:9876/base/gz3d/test/utils/beer/model.sdf', false);
      xhttp.send();
      sdf = xhttp.responseXML;
      model = sdfparser.spawnFromSDF(sdf);
      scene.add(model);

      // no visuals intially
      visual = model.getObjectByName('INERTIA_VISUAL');
      expect(visual).toEqual(undefined);

      // if there was no selected entity it shouldn't break
      guiEvents.emit('view_inertia');
      visual = model.getObjectByName('INERTIA_VISUAL');
      expect(visual).toEqual(undefined);

      // select a model and then view the visuals
      scene.selectedEntity = model;
      guiEvents.emit('view_inertia');
      visual = model.getObjectByName('INERTIA_VISUAL');
      expect(visual).not.toEqual(undefined);

      // hide the visuals
      guiEvents.emit('view_inertia');
      visual = model.getObjectByName('INERTIA_VISUAL');
      expect(visual).toEqual(undefined);

      // test to view the visuals when they already exist
      guiEvents.emit('view_inertia');
      visual = model.getObjectByName('INERTIA_VISUAL');
      expect(visual).not.toEqual(undefined);

      // hide the visuals
      guiEvents.emit('view_inertia');
      visual = model.getObjectByName('INERTIA_VISUAL');
      expect(visual).toEqual(undefined);
    });
  });

  // Test gzscene.setFromObject
  describe('Test gzscene setFromObject', function() {
    it('Should set the correct box vertices', function() {

      var mesh, v1, v2, box, obj;
      // add a box at (0,0,0)
      mesh = scene.createBox(1, 1, 1);
      v1 = new THREE.Vector3(-0.5, -0.5, -0.5);
      v2 = new THREE.Vector3(0.5, 0.5, 0.5);
      obj = new THREE.Object3D();
      obj.add(mesh);
      box = new THREE.Box3();
      scene.setFromObject(box, obj);
      expect(box.min).toEqual(v1);
      expect(box.max).toEqual(v2);
    });
  });
});
