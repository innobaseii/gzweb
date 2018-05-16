/**
 * Converts an Ogre material script into JSON
 * @constructor
 */
GZ3D.Ogre2Json = function()
{
  this.emitter = globalEmitter || new EventEmitter2({verboseMemoryLeak: true});

  // Keeps the whole material file as an Object
  this.materialObj = [];

  // Keeps all materials in the format needed by GZ3D.SdfParser
  this.materials = {};
};

/**
 * Load materials from a .material file
 * @param _url Full URL to .material file
 */
GZ3D.Ogre2Json.prototype.LoadFromUrl = function(_url)
{
  var that = this;

  var fileLoaded = function(_text)
  {
    that.Parse(_text);
  };

  var fileLoader = new THREE.FileLoader();
  fileLoader.load(_url, fileLoaded);

  return true;
};

/**
 * Parse material script and store it into this.materials
 * @param _str Material script as a string.
 */
GZ3D.Ogre2Json.prototype.Parse = function(_str)
{
  var str = _str;

  // Remove "material " and properly add commas if more than one
  str = str.replace(/material /g, function(match, offset)
      {
        if (offset === 0)
        {
          return '';
        }
        else
        {
          return '},{';
        }
      });

  // Remove leading and trailing whitespaces per line
  str = str.replace(/^\s+/gm,'');
  str = str.replace(/\s+$/gm,'');

  // If line has more than one space, it has an array
  str = str.replace(/(.* .*){2,}/g, function(match)
      {
        var parts = match.split(' ');

        var res = parts[0] + ' [';
        for (var i = 1; i < (parts.length - 1); i++)
        {
          res += parts[i] + ',';
        }
        res += parts[parts.length-1] + ']';

        return res;
      });

  // Add comma to end of lines that have space
  str = str.replace(/(.* .*)/g,'$&,');

  // Remove new lines
  str = str.replace(/\r?\n|\r/g,'');

  // Add key-value separators
  str = str.replace(/\s/g, ': ');
  str = str.replace(/{/g, function(match, offset, full)
      {
         // Don't add if preceeded by comma
         if (full[offset-1] === ',')
         {
           return '{';
         }
         else
         {
           return ': {';
         }
      });


  // Add surrounding brackets
  str = '[{' + str + '}]';

  // Wrap keys and values with double quotes
  str = str.replace(/([\w/\.]+)/g, '"$&"');

  // Remove comma from last property in a sequence
  str = str.replace(/,}/g, '}');

  // Add comma between sibling objects
  str = str.replace(/}"/g, '},"');

  // Parse JSON
  try
  {
    this.materialObj = JSON.parse(str);
  }
  catch(e)
  {
    console.error('Failed to parse JSON. Original string:');
    console.error(_str);
    console.error('Modified string:');
    console.error(str);
    return false;
  }

  // Arrange materials array so that GZ3d.SdfParser can consume it
  for (var material in this.materialObj)
  {
    for (var matName in this.materialObj[material])
    {
      var matValue = this.materialObj[material][matName];

      if (typeof matValue !== 'object')
      {
        console.error('Failed to parse material [' + matName + ']');
        continue;
      }

      this.materials[matName] = {};

      // Ambient
      var ambient = _.get(this.materialObj[material],
          matName + '.technique.pass.ambient');
      if (ambient !== undefined)
      {
        this.materials[matName]['ambient'] = ambient.map(Number);
      }

      // Diffuse
      var diffuse = _.get(this.materialObj[material],
          matName + '.technique.pass.diffuse');
      if (diffuse !== undefined)
      {
        this.materials[matName]['diffuse'] = diffuse.map(Number);
      }

      // Specular
      var specular = _.get(this.materialObj[material],
          matName + '.technique.pass.specular');
      if (specular !== undefined)
      {
        this.materials[matName]['specular'] = specular.map(Number);
      }

      // Emissive
      var emissive = _.get(this.materialObj[material],
          matName + '.technique.pass.emissive');
      if (emissive !== undefined)
      {
        this.materials[matName]['emissive'] = emissive.map(Number);
      }

      // Depth write
      var depthWrite = _.get(this.materialObj[material],
          matName + '.technique.pass.depth_write');
      if (depthWrite !== undefined)
      {
        this.materials[matName]['depth_write'] = depthWrite !== 'off';
      }

      // Depth check
      var depthCheck = _.get(this.materialObj[material],
          matName + '.technique.pass.depth_check');
      if (depthCheck !== undefined)
      {
        this.materials[matName]['depth_check'] = depthCheck !== 'off';
      }

      // Texture
      var texture = _.get(this.materialObj[material],
          matName + '.technique.pass.texture_unit.texture');
      if (texture !== undefined)
      {
        this.materials[matName]['texture'] = texture;
      }

      // Scale
      var scale = _.get(this.materialObj[material],
          matName + '.technique.pass.texture_unit.scale');
      if (scale !== undefined)
      {
        this.materials[matName]['scale'] = scale.map(Number);
      }
    }
  }

  // Notify others
  this.emitter.emit('material', this.materials);
  return true;
};
