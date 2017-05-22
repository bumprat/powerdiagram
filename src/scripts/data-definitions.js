var voltageLevelEnum = "330kV|750kV|110kV|35kV";

export default  {
  substation : [
    {
      propName : "name",
      propChName : "名称",
      propType : "string",
      defaultValue : "变电站"
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
      propType : "entityName",
      defaultValue : ""
    },{
      propName : "endSub",
      propChName : "末端厂站",
      propType : "entityName",
      defaultValue : ""
    },{
      propName : "startbind",
      propChName : "始端共串线路",
      propType : "entityName",
      defaultValue : ""
    },{
      propName : "endbind",
      propChName : "末端共串线路",
      propType : "entityName",
      defaultValue : ""
    },{
      propName : "pointList",
      propChName : "路径",
      propType : "Array[Point]",
      defaultValue : []
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
  ],
  pointer : [
    {
      propName : "name",
      propChName : "名称",
      propType : "string",
      defaultValue : "pointer"
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

export var defaultData={"substation":[{"name":"咸林变","voltageLevel":"330kV","location":{"x":178.66554192701975,"y":44.458204785982765}},{"name":"上苑变","voltageLevel":"330kV","location":{"x":98.82999980449677,"y":24.06834129492443}},{"name":"渭南变","voltageLevel":"330kV","location":{"x":126.94383517901099,"y":-35.88487100601197}},{"name":"灵宝换流站","voltageLevel":"330kV","location":{"x":342.2181399265925,"y":-1.9495332241058336}},{"name":"来化牵引变","voltageLevel":"330kV","location":{"x":214.23733878135678,"y":-60.52907721201579}},{"name":"信义变","voltageLevel":"750kV","location":{"x":178.88512114683783,"y":-9.928445061047874}}],"powerline":[{"name":"信来1线","voltageLevel":"330kV","startSub":"来化牵引变","endSub":"信义变","startbind":"","endbind":"信渭1线","pointList":[{"x":210.43288346131638,"y":-63.4632520278295},{"x":176.41405699650446,"y":-18.626432677110035}]},{"name":"信来2线","voltageLevel":"330kV","startSub":"来化牵引变","endSub":"信义变","startbind":"","endbind":"信灵1线","pointList":[{"x":216.790634671847,"y":-59.17451337973277},{"x":178.82578911383942,"y":-11.805173059304552}]},{"name":"信灵1线","voltageLevel":"330kV","startSub":"信义变","endSub":"灵宝换流站","startbind":"信来2线","endbind":"","pointList":[{"x":181.22351296742758,"y":-15.562434395154318},{"x":343.6945098638535,"y":-7.63701991240183}]},{"name":"信灵2线","voltageLevel":"330kV","startSub":"信义变","endSub":"灵宝换流站","startbind":"信咸2线","endbind":"","pointList":[{"x":182.45507927735645,"y":-7.63701991240183},{"x":345.4921772082647,"y":0.8544956048329718}]},{"name":"信咸1线","voltageLevel":"330kV","startSub":"咸林变","endSub":"信义变","startbind":"","endbind":"信上2线","pointList":[{"x":175.2297699848811,"y":49.17181201775869},{"x":175.2297699848811,"y":-7.438291430473321}]},{"name":"信咸2线","voltageLevel":"330kV","startSub":"咸林变","endSub":"信义变","startbind":"","endbind":"信灵2线","pointList":[{"x":181.12414872646335,"y":44.3275910615921},{"x":181.79225981235507,"y":-12.792562643686935}]},{"name":"信上1线","voltageLevel":"330kV","startSub":"上苑变","endSub":"信义变","startbind":"","endbind":"信渭2线","pointList":[{"x":94.4113262097041,"y":20.434663414955146},{"x":174.79767310619354,"y":-14.663600722948711}]},{"name":"信上2线","voltageLevel":"330kV","startSub":"上苑变","endSub":"信义变","startbind":"","endbind":"信咸1线","pointList":[{"x":101.40326710542044,"y":25.196840087572735},{"x":178.95910882949826,"y":-8.769221981366476}]},{"name":"信渭2线","voltageLevel":"330kV","startSub":"渭南变","endSub":"信义变","startbind":"","endbind":"信上1线","pointList":[{"x":122.34900538126627,"y":-33.67766749858856},{"x":174.99640158812204,"y":-5.93871680895487}]},{"name":"信渭1线","voltageLevel":"330kV","startSub":"渭南变","endSub":"信义变","startbind":"","endbind":"信来1线","pointList":[{"x":129.1422177950541,"y":-37.07427370548248},{"x":178.95910882949826,"y":-13.298030257225042}]}],"generation":[]};
