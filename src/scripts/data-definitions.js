var voltageLevelEnum = "330kV|750kV|110kV|35kV";

var dataDef = {
  substation : [
    {
      propName : "name",
      propChName : "名称",
      propType : "string",
      defaultValue : "厂站"
    },{
      propName : "voltageLevel",
      propChName : "电压等级",
      propType : "enum",
      defaultValue : "330kV",
      valEnum : voltageLevelEnum
    },{
      propName : "location",
      propChName : "坐标",
      propType : "point",
      defaultValue : {x:0, y:0}
    }
  ],
  powerline : [
    {
      propName : "name",
      propChName : "名称",
      propType : "string",
      defaultValue : "交流线路"
    },{
      propName : "voltageLevel",
      propChName : "电压等级",
      propType : "enum",
      defaultValue : "330kV",
      valEnum : voltageLevelEnum
    },{
      propName : "startSub",
      propChName : "始端厂站",
      propType : "shape",
      defaultValue : null
    },{
      propName : "endSub",
      propChName : "末端厂站",
      propType : "shape",
      defaultValue : null
    },{
      propName : "startbind",
      propChName : "始端共串线路",
      propType : "shape",
      defaultValue : null
    },{
      propName : "endbind",
      propChName : "末端共串线路",
      propType : "shape",
      defaultValue : null
    },{
      propName : "path",
      propChName : "路径字符串",
      propType : "text",
      defaultValue : ""
    }
  ],
  generation : [
    {
      propName : "name",
      propChName : "名称",
      propType : "string",
      defaultValue : "发电厂"
    },{
      propName : "voltageLevel",
      propChName : "电压等级",
      propType : "enum",
      defaultValue : "330kV",
      valEnum : voltageLevelEnum
    },{
      propName : "location",
      propChName : "坐标",
      propType : "point",
      defaultValue : {x:0, y:0}
    }
  ]
};

export default dataDef;
